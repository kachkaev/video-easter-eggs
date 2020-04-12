import { initProblems } from "./initProblems";

describe("initProblems()", () => {
  test(`works`, async () => {
    const initializedProblems = initProblems();
    expect(Object.keys(initializedProblems)).toHaveLength(2);
    const [getProblems, reportProblem] = initializedProblems;

    const initialProblems = getProblems();
    expect(initialProblems).toEqual([]);
    (initialProblems as any).push("oops");

    reportProblem({ type: "x", severity: "error" });
    reportProblem({ type: "y", severity: "warning" });
    const problems = getProblems();

    expect(problems).toEqual([
      { type: "x", severity: "error" },
      { type: "y", severity: "warning" },
    ]);
  });
});
