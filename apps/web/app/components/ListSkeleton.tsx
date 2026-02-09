import { CardSkeleton } from './CardSkeleton';

export function ListSkeleton() {
    return (
        <div className="min-w-[272px] max-w-[272px] bg-[#f1f2f4] rounded-xl p-2 shadow-sm flex flex-col max-h-full animate-pulse">
            <div className="px-2 py-2 mb-1 flex justify-between items-center">
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex-1 overflow-y-hidden p-1">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}
