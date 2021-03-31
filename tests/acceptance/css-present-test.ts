import { module, test } from "qunit";
import { visit, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";

function getStyleSheet(name: string): CSSStyleSheet | undefined {
  const stylesheets: CSSStyleSheet[] = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    stylesheets.push(document.styleSheets[i]);
  }

  return stylesheets.find((stylesheet) =>
    stylesheet.href.match(new RegExp(name))
  );
}

function hasRule(stylesheet: CSSStyleSheet | undefined, name: string) {
  if (!stylesheet) {
    return false;
  }
  const rules: CSSStyleRule[] = [];
  for (let i = 0; i < stylesheet.cssRules.length; i++) {
    rules.push(stylesheet.cssRules[i] as CSSStyleRule);
  }
  return rules.find((rule) => rule.selectorText.match(new RegExp(name)));
}

module("Acceptance | css present", function (hooks) {
  setupApplicationTest(hooks);

  test("Pods CSS present", async function (assert) {
    await visit("/");
    const dummyStyles = getStyleSheet("dummy.css");

    assert.ok(hasRule(dummyStyles, ".TestComponent"));
  });

  test("Global CSS present", async function (assert) {
    await visit("/");
    const dummyStyles = getStyleSheet("dummy.css");

    assert.ok(hasRule(dummyStyles, ".GlobalAppCSS"));
  });
});
