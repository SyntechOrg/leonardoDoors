import React, { useMemo } from "react";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];
  while (i <= to) {
    range.push(i);
    i += step;
  }
  return range;
};

const Pagination = React.memo(({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  pageNeighbours = 1,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = useMemo(() => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  }, [currentPage, totalPages, pageNeighbours]);

  if (!totalItems || totalPages <= 1) return null;

  const handleMoveLeft = () => onPageChange(currentPage - 1);
  const handleMoveRight = () => onPageChange(currentPage + 1);

  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between text-sm font-medium border-t pt-8 border-gray-100">
        <div className="text-gray-500 font-medium">
            Zeige {startItem}-{endItem} von {totalItems} Ergebnissen
        </div>

        <ul className="flex items-center gap-2 list-none m-0 p-0">
            <li>
                <button
                    onClick={handleMoveLeft}
                    disabled={currentPage === 1}
                    aria-label="Vorherige Seite"
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 active:bg-gray-200 text-gray-600"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
            </li>

            {pageNumbers.map((page, index) => {
                if (page === LEFT_PAGE || page === RIGHT_PAGE) {
                    return (
                        <li key={index}>
                            <span className="px-3 py-2 text-gray-400 select-none">&hellip;</span>
                        </li>
                    );
                }

                return (
                    <li key={index}>
                        <button
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-sm font-semibold ${
                                currentPage === page
                                    ? "bg-black text-white shadow-md"
                                    : "hover:bg-gray-100 text-gray-600 hover:text-black"
                            }`}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </button>
                    </li>
                );
            })}

            <li>
                <button
                    onClick={handleMoveRight}
                    disabled={currentPage === totalPages}
                    aria-label="Nächste Seite"
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 active:bg-gray-200 text-gray-600"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </li>
        </ul>
    </nav>
  );
});

Pagination.displayName = "Pagination";

export default Pagination;
