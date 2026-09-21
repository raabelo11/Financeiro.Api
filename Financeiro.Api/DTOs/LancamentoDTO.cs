using Financeiro.Api.Enums;

namespace Financeiro.Api.DTOs
{
    public class LancamentoDTO
    {
        public string NomeLancamento { get; set; } = string.Empty;
        public decimal ValorLancamento { get; set; }
        public TipoLancamento TipoLancamento { get; set; }
    }
}
