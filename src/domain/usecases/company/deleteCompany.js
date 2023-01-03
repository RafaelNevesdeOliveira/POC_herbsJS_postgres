const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Company = require('../../entities/company')
const CompanyRepository = require('../../../infra/data/repositories/companyRepository')

const dependency = { CompanyRepository }

const deleteCompany = injection =>
  usecase('Delete Company', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteCompany ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Company exist': step(async ctx => {
      const repo = new ctx.di.CompanyRepository(injection)
      const [company] = await repo.findByID(ctx.req.id)
      ctx.company = company

      if (company) return Ok()
      return Err.notFound({
          message: `Company ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Company' }
      })
    }),

    'Delete the Company': step(async ctx => {
      const repo = new ctx.di.CompanyRepository(injection)
      ctx.ret = await repo.delete(ctx.company)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteCompany, 'DeleteCompany')
    .metadata({ group: 'Company', operation: herbarium.crud.delete, entity: Company })
    .usecase