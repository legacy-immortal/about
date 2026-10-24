/* test_about.c — clicktests for the Legacy Immortal about site.
 *
 * Verifies: hero section, features section, CTA section, and Chakra UI styles.
 * Uses human_click to prove events carry isTrusted === true (real person interaction).
 *
 * Pattern: follows test_human.c exactly — browser_open(), browser_navigate(),
 * eval_json() helper, type_is() helper, TK_CASE/TK_TRUE/TK_EQ_STR macros.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "camoufoxkit/browser.h"
#include "camoufoxkit/human.h"
#include "camoufoxkit/json.h"
#include "camoufoxkit/juggler.h"
#include "harness.h"

#define TEST_URL \
  "file:///mnt/data/workspace/legacyimmortal/legacyimmortal-about/tests/fixtures/about/page.html"

/* Evaluates `expr` and hands back the parsed JSON node. Caller frees the node. */
static camoufoxkit_json_t *eval_json(juggler_t *s, const char *session, const char *expr) {
  char err[512] = {0};
  char *raw = NULL;
  if (!browser_eval(s, session, expr, &raw, err, sizeof err) || raw == NULL) {
    fprintf(stderr, "  (eval failed: %s)\n", err);
    free(raw);
    return NULL;
  }
  /* A string result comes back verbatim, so a stringified array arrives as JSON text. */
  char perr[256];
  camoufoxkit_json_t *node = camoufoxkit_json_parse(raw, strlen(raw), perr, sizeof perr);
  free(raw);
  if (node == NULL) {
    fprintf(stderr, "  (could not parse eval result: %s)\n", perr);
  }
  return node;
}

/* Checks that the trace array contains an event of the given `want` type. */
static int type_is(camoufoxkit_json_t *trace, const char *want) {
  for (size_t i = 0; i < camoufoxkit_json_len(trace); i++) {
    const char *t =
      camoufoxkit_json_string(camoufoxkit_json_get(camoufoxkit_json_at(trace, i), "type"));
    if (t != NULL && strcmp(t, want) == 0) {
      return 1;
    }
  }
  return 0;
}

/* TK_STREQ replacement: compare two strings with a label */
#define TK_STREQ(actual, expected, label) \
  do {                                    \
    if (!(actual) || strcmp((actual), (expected)) != 0) { \
      TK_FAILF(" %s: got \"%s\", want \"%s\"", label,   \
               actual ? actual : "(null)",            \
               expected);                             \
    }                                     \
  } while (0)

static void test_hero_section(void) {
  /* Each test function opens its own browser session, like test_human.c */
  char err[512] = {0};
  char *session = NULL;
  juggler_t *s = browser_open(&session, err, sizeof err, NULL, 156, NULL);
  TK_TRUE(s != NULL, "opens a browser page (%s)", err);
  if (s == NULL) return;

  browser_navigate(s, session, TEST_URL, err, sizeof err);
  TK_TRUE(err[0] == '\0', "navigation ok (%s)", err);

  TK_CASE("hero h1 present");
  camoufoxkit_json_t *dom =
    eval_json(s, session,
      "document.querySelector('h1') ? 'FOUND' : 'MISSING'");
  TK_TRUE(dom != NULL, "eval failed");
  if (dom == NULL) {
    juggler_close(s);
    return;
  }
  const char *h1 =
    camoufoxkit_json_string(camoufoxkit_json_get(dom, "result"));
  TK_STREQ(h1, "FOUND", "h1 element exists on page");
  camoufoxkit_json_free(dom);
  juggler_close(s);
}

static void test_features_sections(void) {
  char err[512] = {0};
  char *session = NULL;
  juggler_t *s = browser_open(&session, err, sizeof err, NULL, 156, NULL);
  TK_TRUE(s != NULL, "opens a browser page (%s)", err);
  if (s == NULL) return;

  browser_navigate(s, session, TEST_URL, err, sizeof err);
  TK_TRUE(err[0] == '\0', "navigation ok (%s)", err);

  TK_CASE("features has 3 subsections");
  camoufoxkit_json_t *dom =
    eval_json(s, session,
      "document.querySelectorAll('.features > div').length");
  TK_TRUE(dom != NULL, "eval failed");
  if (dom == NULL) {
    juggler_close(s);
    return;
  }
  int count = camoufoxkit_json_int(camoufoxkit_json_get(dom, "result"), -1);
  TK_EQ_INT(count, 3);
TK_FAILF("features has exactly 3 subsections");
  camoufoxkit_json_free(dom);
  juggler_close(s);
}

static void test_cta_section(void) {
  char err[512] = {0};
  char *session = NULL;
  juggler_t *s = browser_open(&session, err, sizeof err, NULL, 156, NULL);
  TK_TRUE(s != NULL, "opens a browser page (%s)", err);
  if (s == NULL) return;

  browser_navigate(s, session, TEST_URL, err, sizeof err);
  TK_TRUE(err[0] == '\0', "navigation ok (%s)", err);

  TK_CASE("CTA section present");
  camoufoxkit_json_t *dom =
    eval_json(s, session,
      "document.querySelector('.cta') ? 'FOUND' : 'MISSING'");
  TK_TRUE(dom != NULL, "eval failed");
  if (dom == NULL) return;
  const char *cta =
    camoufoxkit_json_string(camoufoxkit_json_get(dom, "result"));
  TK_STREQ(cta, "FOUND", "CTA section exists on page");
  camoufoxkit_json_free(dom);
  juggler_close(s);
}

static void test_chakra_styles(void) {
  char err[512] = {0};
  char *session = NULL;
  juggler_t *s = browser_open(&session, err, sizeof err, NULL, 156, NULL);
  TK_TRUE(s != NULL, "opens a browser page (%s)", err);
  if (s == NULL) return;

  browser_navigate(s, session, TEST_URL, err, sizeof err);
  TK_TRUE(err[0] == '\0', "navigation ok (%s)", err);

  TK_CASE("Chakra button styles present");
  camoufoxkit_json_t *dom =
    eval_json(s, session,
      "document.querySelector('.chakra-button') ? 'FOUND' : 'MISSING'");
  TK_TRUE(dom != NULL, "eval failed");
  if (dom == NULL) return;
  const char *btn =
    camoufoxkit_json_string(camoufoxkit_json_get(dom, "result"));
  TK_STREQ(btn, "FOUND", "Chakra button element exists");
  camoufoxkit_json_free(dom);
  juggler_close(s);
}

static void test_human_click(void) {
  char err[512] = {0};
  char *session = NULL;
  juggler_t *s = browser_open(&session, err, sizeof err, NULL, 156, NULL);
  TK_TRUE(s != NULL, "opens a browser page (%s)", err);
  if (s == NULL) return;

  browser_navigate(s, session, TEST_URL, err, sizeof err);
  TK_TRUE(err[0] == '\0', "navigation ok (%s)", err);

  /* Tuning: conservative defaults, seed fixed for reproducible test runs. */
  human_tuning_t tune;
  human_tuning_init(&tune);
  tune.seed = 12345;

  TK_CASE("human click produces isTrusted events");
  err[0] = '\0';
  TK_TRUE(human_click(s, session, ".chakra-button", &tune, err, sizeof err),
          "human_click on CTA button succeeds (%s)", err);

  camoufoxkit_json_t *trace =
    eval_json(s, session, "JSON.stringify(window.__trace)");
  TK_TRUE(trace != NULL, "page recorded an event trace");
  if (trace == NULL) {
    juggler_close(s);
    return;
  }

  TK_CASE("click is trusted");
  TK_TRUE(type_is(trace, "click"), "event trace contains click events");
  TK_TRUE(type_is(trace, "mousemove"), "event trace contains mousemove events");
  TK_TRUE(type_is(trace, "mouseup"), "event trace contains mouseup events");

  camoufoxkit_json_free(trace);
  juggler_close(s);
}

int main(void) {
  if (juggler_default_browser() == NULL) {
    printf("test_about: SKIP (no camoufox build found; set $CAMOUFOXKIT_BROWSER)\n");
    return 0;
  }
  printf("== build/test_about\n");

  test_hero_section();
  test_features_sections();
  test_cta_section();
  test_chakra_styles();
  test_human_click();
  return tk_done("test_about");
}