// local imports
import { testConfig } from '../../../common'
import '../../../../jest.setup'
import { runPipeline } from '../../generate'
import { mockCollectedDoc } from '../../testUtils'

// the config to use in tests
const config = testConfig()

test('pagination arguments stripped from key', async function () {
	const docs = [
		mockCollectedDoc(
			`
            fragment PaginatedFragment on User {
                friendsByCursor(first:10, filter: "hello") @paginate {
                    edges { 
                        node {
                            id
                        }
                    }
                }
            }
        `
		),
	]

	await runPipeline(config, docs)

	// look at the artifact for the generated pagination query
	await expect(docs[0]).toMatchArtifactSnapshot(`
					export default {
					    name: "PaginatedFragment",
					    kind: "HoudiniFragment",
					    hash: "d655188329bfa82826d0e09c9b56fb90c276ed5b3b155784c3358db3cac30c87",

					    refetch: {
					        update: "append",
					        path: ["friendsByCursor"],
					        method: "cursor",
					        pageSize: 10,
					        embedded: true,
					        targetType: "Node",
					        paginated: true,
					        direction: "forward"
					    },

					    raw: \`fragment PaginatedFragment on User {
					  friendsByCursor(first: $first, filter: "hello", after: $after) {
					    edges {
					      node {
					        id
					      }
					    }
					    edges {
					      cursor
					      node {
					        __typename
					      }
					    }
					    pageInfo {
					      hasPreviousPage
					      hasNextPage
					      startCursor
					      endCursor
					    }
					  }
					}
					\`,

					    rootType: "User",

					    selection: {
					        friendsByCursor: {
					            type: "UserConnection",
					            keyRaw: "friendsByCursor(filter: \\"hello\\")::paginated",

					            fields: {
					                edges: {
					                    type: "UserEdge",
					                    keyRaw: "edges",

					                    fields: {
					                        cursor: {
					                            type: "String",
					                            keyRaw: "cursor"
					                        },

					                        node: {
					                            type: "User",
					                            keyRaw: "node",
					                            nullable: true,

					                            fields: {
					                                __typename: {
					                                    type: "String",
					                                    keyRaw: "__typename"
					                                },

					                                id: {
					                                    type: "ID",
					                                    keyRaw: "id"
					                                }
					                            }
					                        }
					                    },

					                    update: "append"
					                },

					                pageInfo: {
					                    type: "PageInfo",
					                    keyRaw: "pageInfo",

					                    fields: {
					                        hasPreviousPage: {
					                            type: "Boolean",
					                            keyRaw: "hasPreviousPage"
					                        },

					                        hasNextPage: {
					                            type: "Boolean",
					                            keyRaw: "hasNextPage"
					                        },

					                        startCursor: {
					                            type: "String",
					                            keyRaw: "startCursor"
					                        },

					                        endCursor: {
					                            type: "String",
					                            keyRaw: "endCursor"
					                        }
					                    }
					                }
					            }
					        }
					    }
					};

					"HoudiniHash=07f77134a0c1b4f15f75077d133a91a35472ac050e799e9ad652c8b4dfb93ef9";
				`)
})

test('offset based pagination marks appropriate field', async function () {
	const docs = [
		mockCollectedDoc(
			`
            fragment PaginatedFragment on User {
                friendsByOffset(limit:10, filter: "hello") @paginate {
					id
                }
            }
        `
		),
	]

	await runPipeline(config, docs)

	// look at the artifact for the generated pagination query
	await expect(docs[0]).toMatchArtifactSnapshot(`
					export default {
					    name: "PaginatedFragment",
					    kind: "HoudiniFragment",
					    hash: "61656f834b4f2afccdd42328b499f288fc9776befbef14154133565e0ac7e8b6",

					    refetch: {
					        update: "append",
					        path: ["friendsByOffset"],
					        method: "offset",
					        pageSize: 10,
					        embedded: true,
					        targetType: "Node",
					        paginated: true,
					        direction: "forward"
					    },

					    raw: \`fragment PaginatedFragment on User {
					  friendsByOffset(limit: $limit, filter: "hello", offset: $offset) {
					    id
					  }
					}
					\`,

					    rootType: "User",

					    selection: {
					        friendsByOffset: {
					            type: "User",
					            keyRaw: "friendsByOffset(filter: \\"hello\\")::paginated",
					            update: "append",

					            fields: {
					                id: {
					                    type: "ID",
					                    keyRaw: "id"
					                }
					            }
					        }
					    }
					};

					"HoudiniHash=80c97a259c558a65e1998f7e817c6e433b2c3b5d6cad4c2ae2803324fe8e5f58";
				`)
})

test('cursor as scalar gets the right pagination query argument types', async function () {
	const docs = [
		mockCollectedDoc(
			`
            query ScalarPagination {
				user { 
					friendsByCursorScalar(first:10, filter: "hello") @paginate {
						edges { 
							node {
								friendsByCursor { 
									edges { 
										node { 
											id
										}
									}
								}
							}
                        }
                    }
                }
            }
        `
		),
	]

	await runPipeline(config, docs)

	// look at the artifact for the generated pagination query
	await expect(docs[0]).toMatchArtifactSnapshot(`
					export default {
					    name: "ScalarPagination",
					    kind: "HoudiniQuery",
					    hash: "09863f3b665ef14816cc6b9cc965f12bb68ea569345d3f346415ba7a8b8af71c",

					    refetch: {
					        update: "append",
					        path: ["user", "friendsByCursorScalar"],
					        method: "cursor",
					        pageSize: 10,
					        embedded: false,
					        targetType: "Query",
					        paginated: true,
					        direction: "forward"
					    },

					    raw: \`query ScalarPagination($first: Int = 10, $after: Cursor) {
					  user {
					    friendsByCursorScalar(first: $first, filter: "hello", after: $after) {
					      edges {
					        node {
					          friendsByCursor {
					            edges {
					              node {
					                id
					              }
					            }
					          }
					          id
					        }
					      }
					      edges {
					        cursor
					        node {
					          __typename
					        }
					      }
					      pageInfo {
					        hasPreviousPage
					        hasNextPage
					        startCursor
					        endCursor
					      }
					    }
					    id
					  }
					}
					\`,

					    rootType: "Query",

					    selection: {
					        user: {
					            type: "User",
					            keyRaw: "user",

					            fields: {
					                friendsByCursorScalar: {
					                    type: "UserConnection",
					                    keyRaw: "friendsByCursorScalar(filter: \\"hello\\")::paginated",

					                    fields: {
					                        edges: {
					                            type: "UserEdge",
					                            keyRaw: "edges",

					                            fields: {
					                                cursor: {
					                                    type: "String",
					                                    keyRaw: "cursor"
					                                },

					                                node: {
					                                    type: "User",
					                                    keyRaw: "node",
					                                    nullable: true,

					                                    fields: {
					                                        __typename: {
					                                            type: "String",
					                                            keyRaw: "__typename"
					                                        },

					                                        friendsByCursor: {
					                                            type: "UserConnection",
					                                            keyRaw: "friendsByCursor",

					                                            fields: {
					                                                edges: {
					                                                    type: "UserEdge",
					                                                    keyRaw: "edges",

					                                                    fields: {
					                                                        node: {
					                                                            type: "User",
					                                                            keyRaw: "node",
					                                                            nullable: true,

					                                                            fields: {
					                                                                id: {
					                                                                    type: "ID",
					                                                                    keyRaw: "id"
					                                                                }
					                                                            }
					                                                        }
					                                                    }
					                                                }
					                                            }
					                                        },

					                                        id: {
					                                            type: "ID",
					                                            keyRaw: "id"
					                                        }
					                                    }
					                                }
					                            },

					                            update: "append"
					                        },

					                        pageInfo: {
					                            type: "PageInfo",
					                            keyRaw: "pageInfo",

					                            fields: {
					                                hasPreviousPage: {
					                                    type: "Boolean",
					                                    keyRaw: "hasPreviousPage"
					                                },

					                                hasNextPage: {
					                                    type: "Boolean",
					                                    keyRaw: "hasNextPage"
					                                },

					                                startCursor: {
					                                    type: "String",
					                                    keyRaw: "startCursor"
					                                },

					                                endCursor: {
					                                    type: "String",
					                                    keyRaw: "endCursor"
					                                }
					                            }
					                        }
					                    }
					                },

					                id: {
					                    type: "ID",
					                    keyRaw: "id"
					                }
					            }
					        }
					    },

					    input: {
					        fields: {
					            first: "Int",
					            after: "Cursor"
					        },

					        types: {}
					    },

					    policy: "CacheOrNetwork",
					    partial: false
					};

					"HoudiniHash=684d0ec8284ab9f26c70d00f8e6f6824d7b8e35fb67c3724af409e643d573ccd";
				`)
})

test("sibling aliases don't get marked", async function () {
	const docs = [
		mockCollectedDoc(
			`
            fragment PaginatedFragment on User {
                friendsByCursor(first:10, filter: "hello") @paginate {
                    edges { 
                        node {
							friendsByCursor { 
								edges { 
									node { 
										id
									}
								}
							}
                        }
                    }
                }
                friends: friendsByCursor(first:10, filter: "hello") {
                    edges { 
                        node {
							friendsByCursor { 
								edges { 
									node { 
										id
									}
								}
							}
                        }
                    }
                }
            }
        `
		),
	]

	await runPipeline(config, docs)

	// look at the artifact for the generated pagination query
	await expect(docs[0]).toMatchArtifactSnapshot(`
					export default {
					    name: "PaginatedFragment",
					    kind: "HoudiniFragment",
					    hash: "1a2d87a1d79e0241ab3ebda1cd43296a631d99973bb06e4fc66becd42c4a67be",

					    refetch: {
					        update: "append",
					        path: ["friendsByCursor"],
					        method: "cursor",
					        pageSize: 10,
					        embedded: true,
					        targetType: "Node",
					        paginated: true,
					        direction: "forward"
					    },

					    raw: \`fragment PaginatedFragment on User {
					  friendsByCursor(first: $first, filter: "hello", after: $after) {
					    edges {
					      node {
					        friendsByCursor {
					          edges {
					            node {
					              id
					            }
					          }
					        }
					        id
					      }
					    }
					    edges {
					      cursor
					      node {
					        __typename
					      }
					    }
					    pageInfo {
					      hasPreviousPage
					      hasNextPage
					      startCursor
					      endCursor
					    }
					  }
					  friends: friendsByCursor(first: 10, filter: "hello") {
					    edges {
					      node {
					        friendsByCursor {
					          edges {
					            node {
					              id
					            }
					          }
					        }
					        id
					      }
					    }
					  }
					}
					\`,

					    rootType: "User",

					    selection: {
					        friendsByCursor: {
					            type: "UserConnection",
					            keyRaw: "friendsByCursor(filter: \\"hello\\")::paginated",

					            fields: {
					                edges: {
					                    type: "UserEdge",
					                    keyRaw: "edges",

					                    fields: {
					                        cursor: {
					                            type: "String",
					                            keyRaw: "cursor"
					                        },

					                        node: {
					                            type: "User",
					                            keyRaw: "node",
					                            nullable: true,

					                            fields: {
					                                __typename: {
					                                    type: "String",
					                                    keyRaw: "__typename"
					                                },

					                                friendsByCursor: {
					                                    type: "UserConnection",
					                                    keyRaw: "friendsByCursor",

					                                    fields: {
					                                        edges: {
					                                            type: "UserEdge",
					                                            keyRaw: "edges",

					                                            fields: {
					                                                node: {
					                                                    type: "User",
					                                                    keyRaw: "node",
					                                                    nullable: true,

					                                                    fields: {
					                                                        id: {
					                                                            type: "ID",
					                                                            keyRaw: "id"
					                                                        }
					                                                    }
					                                                }
					                                            }
					                                        }
					                                    }
					                                },

					                                id: {
					                                    type: "ID",
					                                    keyRaw: "id"
					                                }
					                            }
					                        }
					                    },

					                    update: "append"
					                },

					                pageInfo: {
					                    type: "PageInfo",
					                    keyRaw: "pageInfo",

					                    fields: {
					                        hasPreviousPage: {
					                            type: "Boolean",
					                            keyRaw: "hasPreviousPage"
					                        },

					                        hasNextPage: {
					                            type: "Boolean",
					                            keyRaw: "hasNextPage"
					                        },

					                        startCursor: {
					                            type: "String",
					                            keyRaw: "startCursor"
					                        },

					                        endCursor: {
					                            type: "String",
					                            keyRaw: "endCursor"
					                        }
					                    }
					                }
					            }
					        },

					        friends: {
					            type: "UserConnection",
					            keyRaw: "friends(first: 10, filter: \\"hello\\")",

					            fields: {
					                edges: {
					                    type: "UserEdge",
					                    keyRaw: "edges",

					                    fields: {
					                        node: {
					                            type: "User",
					                            keyRaw: "node",
					                            nullable: true,

					                            fields: {
					                                friendsByCursor: {
					                                    type: "UserConnection",
					                                    keyRaw: "friendsByCursor",

					                                    fields: {
					                                        edges: {
					                                            type: "UserEdge",
					                                            keyRaw: "edges",

					                                            fields: {
					                                                node: {
					                                                    type: "User",
					                                                    keyRaw: "node",
					                                                    nullable: true,

					                                                    fields: {
					                                                        id: {
					                                                            type: "ID",
					                                                            keyRaw: "id"
					                                                        }
					                                                    }
					                                                }
					                                            }
					                                        }
					                                    }
					                                },

					                                id: {
					                                    type: "ID",
					                                    keyRaw: "id"
					                                }
					                            }
					                        }
					                    }
					                }
					            }
					        }
					    }
					};

					"HoudiniHash=e891a137778914d25c73bc1919ff2943a9ba2cf0ee35c7566bf0694939a189cf";
				`)
})
