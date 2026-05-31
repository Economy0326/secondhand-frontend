type SearchQueryParams = {
  keyword?: string;
  status?: string;
  category?: string;
};

export function buildSearchQuery(params: SearchQueryParams) {
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.append("keyword", params.keyword);
  }

  if (params.status) {
    searchParams.append("status", params.status);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  return searchParams.toString();
}