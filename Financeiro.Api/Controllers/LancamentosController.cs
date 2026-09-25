using Financeiro.Api.Data.Context;
using Financeiro.Api.Data.Models;
using Financeiro.Api.DTOs;
using Financeiro.Api.Enums;
using Financeiro.Api.ReturnValue;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var lancamentos = _context.Lancamentos
                .Include(l => l.Categoria)
                .OrderByDescending(p => p.Id)
                .ToList();

            if (lancamentos.Count == 0)
                return NoContent();

            return Ok(MontarRetornoPorPeriodo(lancamentos));
        }

        [HttpGet("Periodo")]
        public ActionResult GetLancamentosPorPeriodo(DateOnly dataInicio, DateOnly datafim)
        {
            var lancamentos = _context.Lancamentos
                .Include(l => l.Categoria)
                .Where(p => p.DataLancamento >= dataInicio.ToDateTime(TimeOnly.MinValue) && p.DataLancamento <= datafim.ToDateTime(TimeOnly.MaxValue))
                .OrderByDescending(p => p.Id)
                .ToList();

            if (lancamentos.Count == 0)
                return NoContent();

            return Ok(MontarRetornoPorPeriodo(lancamentos));
        }

        [HttpPost]
        public ActionResult InsereLancamento([FromBody] LancamentoDTO lancamentoDTO)
        {
            var erroValidacao = ValidarLancamento(lancamentoDTO);
            if (erroValidacao is not null)
                return BadRequest(erroValidacao);

            var lancamento = new Lancamento
            {
                NomeLancamento = lancamentoDTO.NomeLancamento,
                ValorLancamento = lancamentoDTO.ValorLancamento,
                TipoLancamento = lancamentoDTO.TipoLancamento,
                CategoriaId = lancamentoDTO.CategoriaId,
                DataLancamento = DateTime.Now.Date
            };

            _context.Lancamentos.Add(lancamento);
            _context.SaveChanges();

            var response = CarregarResponse(lancamento.Id);

            return CreatedAtAction(nameof(GetLancamentos), new { id = lancamento.Id }, response);
        }

        [HttpPut("{id}")]
        public ActionResult AtualizaLancamento(int id, [FromBody] LancamentoDTO lancamentoDTO)
        {
            var lancamento = _context.Lancamentos.FirstOrDefault(l => l.Id == id);
            if (lancamento is null)
                return NotFound();

            var erroValidacao = ValidarLancamento(lancamentoDTO);
            if (erroValidacao is not null)
                return BadRequest(erroValidacao);

            lancamento.NomeLancamento = lancamentoDTO.NomeLancamento;
            lancamento.ValorLancamento = lancamentoDTO.ValorLancamento;
            lancamento.TipoLancamento = lancamentoDTO.TipoLancamento;
            lancamento.CategoriaId = lancamentoDTO.CategoriaId;

            _context.SaveChanges();

            var response = CarregarResponse(lancamento.Id);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public ActionResult RemoveLancamento(int id)
        {
            var lancamento = _context.Lancamentos.FirstOrDefault(l => l.Id == id);
            if (lancamento is null)
                return NotFound();

            _context.Lancamentos.Remove(lancamento);
            _context.SaveChanges();

            return NoContent();
        }

        private string? ValidarLancamento(LancamentoDTO lancamentoDTO)
        {
            if (!Enum.IsDefined(typeof(TipoLancamento), lancamentoDTO.TipoLancamento))
                return "TipoLancamento inválido.";

            if (lancamentoDTO.TipoLancamento == TipoLancamento.Receita && lancamentoDTO.CategoriaId != null)
                return "Receita não pode ter categoria.";

            if (lancamentoDTO.TipoLancamento == TipoLancamento.Despesa && lancamentoDTO.CategoriaId == null)
                return "Despesa exige uma categoria.";

            if (lancamentoDTO.TipoLancamento == TipoLancamento.Despesa && !_context.Categorias.Any(c => c.Id == lancamentoDTO.CategoriaId))
                return "Categoria informada não existe.";

            return null;
        }

        private LancamentoResponse CarregarResponse(int id)
        {
            var lancamento = _context.Lancamentos
                .Include(l => l.Categoria)
                .First(l => l.Id == id);

            return MapearParaResponse(lancamento);
        }

        private LancamentoPorPeriodoReturnValue MontarRetornoPorPeriodo(List<Lancamento> lancamentos)
        {
            var despesas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Despesa).Sum(p => p.ValorLancamento);
            var receitas = lancamentos.Where(p => p.TipoLancamento == TipoLancamento.Receita).Sum(p => p.ValorLancamento);

            return new LancamentoPorPeriodoReturnValue
            {
                Lancamentos = lancamentos.Select(MapearParaResponse).ToList(),
                SaldoPeriodo = receitas - despesas,
                TotalReceitas = receitas,
                TotalDespesas = despesas
            };
        }

        private static LancamentoResponse MapearParaResponse(Lancamento l)
        {
            return new LancamentoResponse
            {
                Id = l.Id,
                NomeLancamento = l.NomeLancamento,
                ValorLancamento = l.ValorLancamento,
                TipoLancamento = l.TipoLancamento,
                DataLancamento = l.DataLancamento,
                CategoriaId = l.CategoriaId,
                CategoriaNome = l.Categoria?.Nome,
                CategoriaIcone = l.Categoria?.Icone,
                CategoriaCor = l.Categoria?.Cor
            };
        }
    }
}
