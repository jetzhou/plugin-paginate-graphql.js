import { Octokit } from "@octokit/core";
import { mergeResponses } from "./merge-responses";
import { createIterator } from "./iterator";
import type { Options } from "./options";

const createPaginate = (octokit: Octokit) => {
  const iterator = createIterator(octokit);
  return async <ResponseType extends object = any>(
    query: string,
    initialParameters: Record<string, any> = {},
    options: Options = {},
  ): Promise<ResponseType> => {
    let mergedResponse: ResponseType = {} as ResponseType;
    for await (const response of iterator<ResponseType>(
      query,
      initialParameters,
      options,
    )) {
      mergedResponse = mergeResponses<ResponseType>(mergedResponse, response);
    }
    return mergedResponse;
  };
};

export { createPaginate };
