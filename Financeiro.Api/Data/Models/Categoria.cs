namespace Financeiro.Api.Data.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Icone { get; set; } = string.Empty;
        public string Cor { get; set; } = "#64748B";
        public ICollection<Lancamento> Lancamentos { get; set; } = new List<Lancamento>();
    }
}
