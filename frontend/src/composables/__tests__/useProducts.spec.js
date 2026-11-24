import { describe, expect, it, vi } from "vitest";
import { useProducts } from "../useProducts";

const sample = [
  { id: 1, nom: "Ordinateur portable", prix: 350, prixAchat: 120 },
  { id: 2, nom: "Aspirateur Robot", prix: 500, prixAchat: 200 },
];

describe("useProducts", () => {
  it("loads products and computes the margin of the filtered list", async () => {
    const api = { list: vi.fn().mockResolvedValue(sample) };
    const store = useProducts(api);

    await store.load();
    expect(store.stats.value).toEqual({ count: 2, margin: 530 });

    store.search.value = "robot";
    expect(store.filtered.value.map((p) => p.id)).toEqual([2]);
    expect(store.stats.value.margin).toBe(300);
  });

  it("uses the price filter endpoint when a minimum price is set", async () => {
    const api = { list: vi.fn(), listAbove: vi.fn().mockResolvedValue([sample[1]]) };
    const store = useProducts(api);

    store.minPrice.value = 400;
    await store.load();

    expect(api.listAbove).toHaveBeenCalledWith(400);
    expect(api.list).not.toHaveBeenCalled();
  });

  it("creates new products and updates existing ones", async () => {
    const api = { list: vi.fn().mockResolvedValue([]), create: vi.fn(), update: vi.fn() };
    const store = useProducts(api);

    await store.save({ id: 0, nom: "Clavier", prix: 30, prixAchat: 10 });
    await store.save({ id: 1, nom: "PC", prix: 400, prixAchat: 120 });

    expect(api.create).toHaveBeenCalledTimes(1);
    expect(api.update).toHaveBeenCalledTimes(1);
  });

  it("reports a loading error", async () => {
    const api = { list: vi.fn().mockRejectedValue(new Error("réseau indisponible")) };
    const store = useProducts(api);

    await store.load();
    expect(store.error.value).toContain("réseau indisponible");
  });
});
