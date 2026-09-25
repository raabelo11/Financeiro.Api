namespace Financeiro.Api.ReturnValue
{
    public class LancamentoPorPeriodoReturnValue
    {
        public List<LancamentoResponse> Lancamentos { get; set; } = new List<LancamentoResponse>();
        public decimal SaldoPeriodo { get; set; }
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
    }
}
