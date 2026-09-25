using Financeiro.Api.Enums;

namespace Financeiro.Api.ReturnValue
{
    public class LancamentoResponse
    {
        public int Id { get; set; }
        public string NomeLancamento { get; set; } = string.Empty;
        public decimal ValorLancamento { get; set; }
        public TipoLancamento TipoLancamento { get; set; }
        public DateTime DataLancamento { get; set; }
        public int? CategoriaId { get; set; }
        public string? CategoriaNome { get; set; }
        public string? CategoriaIcone { get; set; }
        public string? CategoriaCor { get; set; }
    }
}
