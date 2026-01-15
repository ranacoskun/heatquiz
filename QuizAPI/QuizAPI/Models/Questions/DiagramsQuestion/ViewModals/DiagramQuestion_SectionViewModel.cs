using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAPI.Models.Questions.DiagramsQuestion.ViewModals
{
    public class DiagramQuestion_SectionViewModel : BaseEntityViewModel
    {
        public bool IsFrozen { get; set; }
        public float x { get; set; }

        public int y1 { get; set; }
        public int y2 { get; set; }

        public float c1x { get; set; }
        public int c1y { get; set; }

        public float c2x { get; set; }
        public int c2y { get; set; }

        //Grading
        public int positionStart { get; set; }
        public bool IsStartPositionLabelSelected { get; set; }
        public int marginY2Neg { get; set; }
        public int marginY2Pos { get; set; }

        public int positionEnd { get; set; }
        public bool IsEndPositionLabelSelected { get; set; }

        public int marginY1Neg { get; set; }
        public int marginY1Pos { get; set; }

        public bool IsPositionRelationLabelSelected { get; set; }
        public string positionRelation { get; set; }

        public bool IsGradientStartLabelSelected { get; set; }
        public string gradientStart { get; set; }

        public bool IsGradientEndLabelSelected { get; set; }
        public string gradientEnd { get; set; }


        public bool IsRatioOfGradientsLabelSelected { get; set; }
        public string ratioOfGradients { get; set; }

        public bool IsLinearLabelSelected { get; set; }
        public bool linear { get; set; }

        public bool IsMaximumSelected { get; set; }
        public bool IsMinimumSelected { get; set; }
    }
}
