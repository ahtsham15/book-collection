import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function AsinOverviewChart() {
  const chartData = [
    { date: "Oct 1", value: 4.5 },
    { date: "Oct 2", value: 4.8 },
    { date: "Oct 3", value: 3.8 },
    { date: "Oct 4", value: 6.2 },
    { date: "Oct 5", value: 5.5 },
    { date: "Oct 6", value: 9.5 },
    { date: "Oct 7", value: 8.5 },
  ];

  return (
    <Card className="border border-gray-200 rounded-lg bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Book Overview
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="text-orange-500 border-orange-300 hover:bg-orange-50 rounded-md"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Select Date Range
        </Button>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="h-80 relative">
          <svg className="w-full h-full" viewBox="0 0 800 320">
            {[0, 2, 4, 6, 8, 10].map((value) => (
              <g key={value}>
                <text
                  x="30"
                  y={280 - value * 25}
                  className="text-sm fill-gray-500"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {value}
                </text>
                <line
                  x1="50"
                  y1={280 - value * 25}
                  x2="750"
                  y2={280 - value * 25}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              </g>
            ))}
            {chartData.map((point, index) => (
              <text
                key={point.date}
                x={50 + index * 116.67}
                y="300"
                className="text-sm fill-gray-500"
                textAnchor="middle"
              >
                {point.date}
              </text>
            ))}
            <path
              d={`M 50,${280 - chartData[0].value * 25} 
                  C 83,${280 - chartData[0].value * 25} 133,${
                280 - chartData[1].value * 25
              } 166.67,${280 - chartData[1].value * 25}
                  C 200,${280 - chartData[1].value * 25} 250,${
                280 - chartData[2].value * 25
              } 283.34,${280 - chartData[2].value * 25}
                  C 316,${280 - chartData[2].value * 25} 366,${
                280 - chartData[3].value * 25
              } 400,${280 - chartData[3].value * 25}
                  C 433,${280 - chartData[3].value * 25} 483,${
                280 - chartData[4].value * 25
              } 516.67,${280 - chartData[4].value * 25}
                  C 550,${280 - chartData[4].value * 25} 600,${
                280 - chartData[5].value * 25
              } 633.34,${280 - chartData[5].value * 25}
                  C 666,${280 - chartData[5].value * 25} 716,${
                280 - chartData[6].value * 25
              } 750,${280 - chartData[6].value * 25}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
