using Financeiro.Api.Data.Models;

namespace Financeiro.Api.ReturnValue
{
    public class LancamentoPorPeriodoReturnValue
    {
        public List<Lancamento> Lancamentos { get; set; } = new List<Lancamento>();
        public decimal SaldoPeriodo { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
    }
}
