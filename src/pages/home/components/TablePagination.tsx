export function TablePagination({ currentPage, totalPages, totalItems, start, itemsPerPage, itemLabel, onPageChange }: { currentPage: number; totalPages: number; totalItems: number; start: number; itemsPerPage: number; itemLabel: string; onPageChange: (page: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
  return <div className="flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:justify-between">
    <p className="text-sm text-slate-500">Exibindo <strong>{totalItems ? start + 1 : 0}–{Math.min(start + itemsPerPage, totalItems)}</strong> de <strong>{totalItems}</strong> {itemLabel}</p>
    <nav className="flex flex-wrap items-center gap-1" aria-label={`Paginação de ${itemLabel}`}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
      {pages.map((page, index) => <span key={page} className="contents">{index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-slate-400">…</span>}<button onClick={() => onPageChange(page)} aria-current={page === currentPage ? 'page' : undefined} className={`size-9 rounded-lg ${page === currentPage ? 'bg-teal-700 text-white' : 'border hover:bg-slate-50'}`}>{page}</button></span>)}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
    </nav>
  </div>
}
