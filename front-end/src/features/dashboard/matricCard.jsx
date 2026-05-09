import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-orange-500",
  bgColor = "bg-orange-50",
}) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
          </div>
          <div
            className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mb-[15px]`}
          >
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}