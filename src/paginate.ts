import { Octokit } from "@octokit/core";
import { mergeResponses } from "./merge-responses";
import { createIterator } from "./iterator";

const createPaginate = (octokit: Octokit) => {
  const iterator = createIterator(octokit);
  return async <ResponseType extends object = any>(
    query: string,
    initialParameters: Record<string, any> = {},
    stopFunction?: (response: ResponseType, done: () => void) => void,
  ): Promise<ResponseType> => {
    let mergedResponse: ResponseType = {} as ResponseType;
    for await (const response of iterator<ResponseType>(
      query,
      initialParameters,
      stopFunction,
    )) {
      mergedResponse = mergeResponses<ResponseType>(mergedResponse, response);
    }
    return mergedResponse;
  };
};

export { createPaginate };
