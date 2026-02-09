export function CardSkeleton() {
    return (
        <div className="bg-white p-2 rounded-lg shadow-sm border-b border-gray-200 mb-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex gap-1">
                <div className="h-2 w-8 bg-gray-200 rounded"></div>
                <div className="h-2 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-end mt-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}
