import { gql } from '@apollo/client';

export const GET_REPOS = gql`
  query GetPinnedItems {
    user(login: "ppconde") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            description
            url
            stargazerCount
            homepageUrl
            openGraphImageUrl
            languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
              nodes {
                id
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;
