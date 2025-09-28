import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Search from "@/components/Search/Search";
import CarsList from "@/components/CarsList/CarsList";
import { getCars } from "@/lib/api";
import Section from "@/components/Section/Section";
import Container from "@/components/Container/Container";
import { buildParams, parseFilters } from "@/lib/filter";

type Props = { searchParams: Promise<Record<string, string | string[]>> };

export default async function CatalogPage({ searchParams }: Props) {
  const qc = new QueryClient();
  const spObj = (await searchParams) || {};
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(spObj)) {
    if (Array.isArray(v)) v.forEach((val) => usp.append(k, val));
    else if (v != null) usp.set(k, v);
  }
  const filters = parseFilters(usp);

  await qc.prefetchInfiniteQuery({
    queryKey: ["cars", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getCars(buildParams(filters, Number(pageParam))),
    getNextPageParam: (lastPage: { page: number; totalPages: number }) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Section>
        <Container>
          <Search />
          <CarsList />
        </Container>
      </Section>
    </HydrationBoundary>
  );
}
