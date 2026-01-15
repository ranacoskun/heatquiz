using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.SimpleClickableQuestion.ViewModels
{
    public class RedrawClickablePartViewModel
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public int Width { get; set; }
        public int Height { get; set; }

        public CLICKABLE_TYPE type { get; set; }

    }

    public enum CLICKABLE_TYPE
    {
        IMAGE = 0,
        CHART = 2
    }


}
