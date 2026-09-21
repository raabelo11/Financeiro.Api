using Financeiro.Api.Enums;

namespace Financeiro.Api.Data.Models
{
    public class Lancamento
    {
        public int Id { get; set; }
        public string NomeLancamento { get; set; } = string.Empty;
        public decimal ValorLancamento { get; set; }
        public TipoLancamento TipoLancamento { get; set; }
        public DateTime DataLancamento { get; set; }
    }
}
