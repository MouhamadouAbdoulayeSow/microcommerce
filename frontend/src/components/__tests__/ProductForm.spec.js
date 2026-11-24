import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import ProductForm from "../ProductForm.vue";

describe("ProductForm", () => {
  it("shows validation errors and does not submit an invalid product", async () => {
    const submit = vi.fn();
    const wrapper = mount(ProductForm, { props: { submit } });

    await wrapper.find("form").trigger("submit");

    expect(submit).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Le nom est obligatoire");
    expect(wrapper.text()).toContain("Le prix doit être supérieur ou égal à 1");
  });

  it("submits a valid product and emits done", async () => {
    const submit = vi.fn().mockResolvedValue();
    const wrapper = mount(ProductForm, { props: { submit } });

    await wrapper.find('input[name="nom"]').setValue("  Clavier ");
    await wrapper.find('input[name="prix"]').setValue(30);
    await wrapper.find('input[name="prixAchat"]').setValue(10);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(submit).toHaveBeenCalledWith({ id: 0, nom: "Clavier", prix: 30, prixAchat: 10 });
    expect(wrapper.emitted("done")).toHaveLength(1);
  });

  it("displays field errors returned by the API", async () => {
    const error = Object.assign(new Error("Données invalides"), { fieldErrors: { nom: "Nom déjà utilisé" } });
    const submit = vi.fn().mockRejectedValue(error);
    const wrapper = mount(ProductForm, { props: { submit } });

    await wrapper.find('input[name="nom"]').setValue("Clavier");
    await wrapper.find('input[name="prix"]').setValue(30);
    await wrapper.find('input[name="prixAchat"]').setValue(10);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(wrapper.text()).toContain("Nom déjà utilisé");
    expect(wrapper.text()).toContain("Données invalides");
  });

  it("switches to edit mode when a product is given", () => {
    const wrapper = mount(ProductForm, {
      props: { submit: vi.fn(), product: { id: 3, nom: "Table", prix: 750, prixAchat: 400 } },
    });

    expect(wrapper.find("h2").text()).toBe("Modifier le produit");
    expect(wrapper.find('input[name="nom"]').element.value).toBe("Table");
  });
});
