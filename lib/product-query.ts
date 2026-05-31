type SearchQueryParams = {
  keyword?: string;
  status?: string;
  category?: string;
};

export function buildSearchQuery(params: SearchQueryParams) {
  const searchParams = new URLSearchParams();

  const keyword = params.keyword?.trim();
  const status = params.status?.trim();
  const category = params.category?.trim();

  if (keyword) {
    searchParams.append("keyword", keyword);
  }

  if (status) {
    searchParams.append("status", status);
  }

  if (category) {
    searchParams.append("category", category);
  }

  return searchParams.toString();
}