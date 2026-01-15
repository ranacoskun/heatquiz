namespace QuizAPI.Models.Questions.PVDiagramQuestion
{
    public class PVDiagramQuestion_Point : BaseEntity
    {
        public PVDiagramQuestion_Group Group { get; set; }
        public int GroupId { get; set; }

        public string Name { get; set; }

        public int X { get; set; }
        public int Y { get; set; }

        public int CX { get; set; }
        public int CY { get; set; }

        public int MarginX { get; set; }
        public int MarginY { get; set; }

        public string InnerColor { get; set; }
        public string OuterColor { get; set; }

        public bool IsPoistionConsiderable { get; set; }
        public string PositionComment { get; set; }

        public bool IsShapeConsiderable { get; set; }
        public string ShapeComment { get; set; }

        public string CurveShape { get; set; }
    }
}
