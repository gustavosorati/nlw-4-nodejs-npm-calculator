import {Request, response, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysUserRepository } from "../repositories/SurveysUserRepository";
import SendMailService  from "../services/SendMailServices";
import path from 'path';
import { AppError } from "../errors/AppError";


class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveysUserRepository);

        const user = await usersRepository.findOne( { email });

        if(!user){
          throw new AppError("User does not exists");
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey) {
          throw new AppError("Survey does not exists");
        }

        const npsPath = path.resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        // Quando colocamos colchetes em volta: [{user_id: user.id}, {value : null}]
        // e separamos cadas condição dentro de um objeto a condição utilizada é OR
        // abaixo o modelo de uma condição de AND
        const surveyUserAlreadyExists = await surveysUserRepository.findOne({
            where: {user_id: user.id, value : null},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        }

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;

            await SendMailService.execute(email, survey.title, variables, npsPath);

            return res.json(surveyUserAlreadyExists);
        }

        // Salvar as informações na Tabela surveyUser
        const surveyUser = surveysUserRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUserRepository.save(surveyUser);


        // Enviar e-mail para o usuário


        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser);
    }
}

export {SendMailController}
