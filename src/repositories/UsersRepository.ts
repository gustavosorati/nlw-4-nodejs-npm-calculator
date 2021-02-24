import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";

//  Extende todos os métodos da classe Repository contem para entidade User
@EntityRepository(User)
class UsersRepository extends Repository<User> {

}

export {UsersRepository}