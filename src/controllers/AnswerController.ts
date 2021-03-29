import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUserRepository } from '../repositories/SurveysUserRepository';

class AnswerController {

    // http://localhost:3000/answers/2?u=5f5dc218-6204-4bbd-828b-8fd7b11a659f
    // routes Params -> Parametros que compõe a rota /answers /1
    // routes.get('/answers/:value' ou '/answers/:value/:arroz')

    // query Params -> Busca, paginação, não obrigatórios
    // ? chave = valor
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        console.log({value, u})

        const surveyUsersRepository = getCustomRepository(SurveysUserRepository);

        const surveyUser = await surveyUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser){
          throw new AppError("Survey User does not exists");
        }

        surveyUser.value = Number(value);

        await surveyUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController };
