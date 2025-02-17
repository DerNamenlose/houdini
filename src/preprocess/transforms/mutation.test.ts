// local imports
import '../../../jest.setup'
import { preprocessorTest } from '../utils'

describe('mutation preprocessor', function () {
	test('happy path', async function () {
		const doc = await preprocessorTest(`
			<script>
				import { mutation } from '$houdini'

				const data = mutation(graphql\`
                    mutation AddUser { 
                        addUser { 
                            id
                        }
                    }
				\`)
			</script>
		`)

		// make sure we added the right stuff
		expect(doc.instance?.content).toMatchInlineSnapshot(`
		import _AddUserStore from "$houdini/stores/AddUser";
		import { mutation } from "$houdini";

		const data = mutation({
		    "kind": "HoudiniMutation",
		    "store": _AddUserStore
		});
	`)
	})
})
