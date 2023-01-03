const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Company = require('../../entities/company')
const CompanyRepository = require('../../../infra/data/repositories/companyRepository')

const dependency = { CompanyRepository }

const findCompany = injection =>
  usecase('Find a Company', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Company,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneCompany ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the Company': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.CompanyRepository(injection)
      const [company] = await repo.findByID(id)
      if (!company) return Err.notFound({ 
        message: `Company entity not found by ID: ${id}`,
        payload: { entity: 'Company', id }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = company)
    })
  })

module.exports =
  herbarium.usecases
    .add(findCompany, 'FindCompany')
    .metadata({ group: 'Company', operation: herbarium.crud.read, entity: Company })
    .usecase