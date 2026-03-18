
// file: src/components/shared/ScheduleNotificationDetail.tsx
import { CalendarDays, Clock } from "lucide-react";

export function ScheduleNotificationDetail({ messageJsonStr }: { messageJsonStr: string }) {
  let payload: any = {};
  try {
    payload = JSON.parse(messageJsonStr);
  } catch (e) {
    // Nếu tin nhắn là text bình thường (không phải JSON)
    return <p className="text-sm text-slate-600 mt-1">{messageJsonStr}</p>;
  }

  // Nếu là tin nhắn JSON nhưng không phải dạng bảng
  if (payload.displayType !== 'TABLE') {
    return <p className="text-sm text-slate-600 mt-1">{payload.text || messageJsonStr}</p>;
  }

  // NẾU LÀ DẠNG BẢNG CA LÀM VIỆC
  return (
    <div className="flex flex-col gap-3 mt-3 animate-in slide-in-from-top-2 duration-200">
      <p className="text-sm font-medium text-slate-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
        {payload.introText}
      </p>
      
      <div className="overflow-hidden border border-blue-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-600 text-white text-xs uppercase font-bold">
            <tr>
              <th scope="col" className="px-3 py-2 border-b border-blue-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Ngày làm
              </th>
              <th scope="col" className="px-3 py-2 border-b border-blue-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Thời gian
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 bg-white">
            {payload.shifts?.map((shift: any, index: number) => (
              <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-2 font-semibold text-slate-700">
                  {shift.dateStr}
                </td>
                <td className="px-3 py-2 font-bold text-emerald-600">
                  {shift.timeStr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}