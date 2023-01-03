const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Company = require('../../entities/company')
const CompanyRepository = require('../../../infra/data/repositories/companyRepository')

const dependency = { CompanyRepository }

const findAllCompany = injection =>
  usecase('Find all Companys', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [Company],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Companys': step(async ctx => {
      const repo = new ctx.di.CompanyRepository(injection)
      const companys = await repo.findAll(ctx.req)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = companys)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllCompany, 'FindAllCompany')
    .metadata({ group: 'Company', operation: herbarium.crud.readAll, entity: Company })
    .usecase
