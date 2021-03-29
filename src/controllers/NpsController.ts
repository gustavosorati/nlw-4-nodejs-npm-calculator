import {Request, response, Response} from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUserRepository } from '../repositories/SurveysUserRepository';

import { SurveysController} from './SurveysController';


/**
 * Como funciona o calculo do NPS
 * 1 2 3 4 5 6 7 8 9 10
 * Detratores => 0 - 6
 * Passivos => 7 - 8
 * Promotores => 9 - 10
 * 
 * (()numero de promotores - numero detratores) / (numero de respondentes)) * 100
 */

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveysUsers.filter(survey => survey.value >= 0 && survey.value <= 6).length;

        const passives = surveysUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length;

        const promotors = surveysUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length;

        const totalAnswers = surveysUsers.length;

        const calculate = Number(((promotors - detractor) / (totalAnswers)) * 100).toFixed(2);

        return response.json({
            detractor,
            passives,
            promotors,
            totalAnswers,
            nps: calculate
        })
    }
}

export { NpsController }