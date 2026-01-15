using QuizAPI.Models.Questions.SimpleClickableQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.DefaultValues.ImageAnswers
{
    public class ImageAnswer : BaseEntity
    {
        public string Name { get; set; }

        public bool Choosable { get; set; }

        //Image
        public string URL { get; set; }
        public long Size { get; set; }

        //Group 
        public ImageAnswerGroup Group { get; set; }
        public int GroupId { get; set; }

        //Root 
        public ImageAnswer Root { get; set; }
        public int? RootId { get; set; }

        //Leafs
        public List<ImageAnswer> Leafs { get; set; }
        = new List<ImageAnswer>();

        public List<ClickImage> ClickImages { get; set; } = new List<ClickImage>();
    }
}
