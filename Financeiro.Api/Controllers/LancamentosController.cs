using Financeiro.Api.Data.Context;
using Financeiro.Api.DTOs;
using Financeiro.Api.Enums;
using Financeiro.Api.ReturnValue;
using Microsoft.AspNetCore.Mvc;

namespace Financeiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LancamentosController(AppDbContext context) : Controller
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        public ActionResult GetLancamentos()
        {
            var lancamentos = _context.Lancamentos.OrderByDescending(p => p.Id).ToList();

            if (lancamentos.Count == 0)
                return NoContent();

            var despesas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Despesa).Sum(p => p.ValorLancamento);
            var receitas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Receita).Sum(p => p.ValorLancamento);

            LancamentoPorPeriodoReturnValue ret = new LancamentoPorPeriodoReturnValue
            {
                Lancamentos = lancamentos,
                SaldoPeriodo = receitas - despesas,
                TotalReceitas = receitas,
                TotalDespesas = despesas
            };

            return Ok(ret);
        }

        [HttpGet("Periodo")]
        public ActionResult GetLancamentosPorPeriodo(DateOnly dataInicio, DateOnly datafim)
        {
            var lancamentos = _context.Lancamentos
                .Where(p => p.DataLancamento >= dataInicio.ToDateTime(TimeOnly.MinValue) && p.DataLancamento <= datafim.ToDateTime(TimeOnly.MaxValue))
                .OrderByDescending(p => p.Id)
                .ToList();

            if (lancamentos.Count == 0)
                return NoContent();

            var despesas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Despesa).Sum(p => p.ValorLancamento);
            var receitas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Receita).Sum(p => p.ValorLancamento);

            LancamentoPorPeriodoReturnValue ret = new LancamentoPorPeriodoReturnValue
            {
                Lancamentos = lancamentos,
                SaldoPeriodo = receitas - despesas,
                TotalReceitas = receitas,
                TotalDespesas = despesas
            };

            return Ok(ret);
        }

        [HttpPost]
        public ActionResult InsereLancamento([FromBody] LancamentoDTO lancamentoDTO)
        {
            if (!Enum.IsDefined(typeof(TipoLancamento), lancamentoDTO.TipoLancamento))
            {
                return BadRequest("TipoLancamento inválido.");
            }

            var lancamento = new Data.Models.Lancamento
            {
                NomeLancamento = lancamentoDTO.NomeLancamento,
                ValorLancamento = lancamentoDTO.ValorLancamento,
                TipoLancamento = lancamentoDTO.TipoLancamento,
                DataLancamento = DateTime.Now.Date
            };

            _context.Lancamentos.Add(lancamento);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetLancamentos), new { id = lancamento.Id }, lancamento);
        }
    }
}
