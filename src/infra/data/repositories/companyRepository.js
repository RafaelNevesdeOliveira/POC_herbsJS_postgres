const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Company = require('../../../domain/entities/company')
const connection = require('../database/connection')

class CompanyRepository extends Repository {
    constructor(injection) {
        super({
            entity: Company,
            table: "companys",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(CompanyRepository, 'CompanyRepository')
        .metadata({ entity: Company })
        .repository