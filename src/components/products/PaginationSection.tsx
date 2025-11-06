import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const PaginationSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [1, 2, 3];

  // read page number from URL, default 1
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = (page: number) => {
    navigate(`?page=${page}`);
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className="text-[#BCBCBC] hover:text-[#C21D0B] transition-colors duration-300"
            />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              isActive={currentPage === page}
              className={`transition-colors duration-300 ${currentPage === page ? "text-[#C21D0B] font-medium" : "text-[#BCBCBC] hover:text-[#C21D0B]"}`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage < pages.length && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className="text-[#BCBCBC] hover:text-[#C21D0B] transition-colors duration-300"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
