import { graffle } from '~/graphql';

export const GET_REPOS_QUERY = graffle.gql`
  query GetPinnedItems {
    user(login: "ppconde") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            __typename
            id
            name
            description
            url
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
