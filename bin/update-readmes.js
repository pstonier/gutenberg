/**
 * Node dependencies.
 */
const { join } = require( 'path' );
const spawnSync = require( 'child_process' ).spawnSync;

const packages = [
	'a11y',
	'autop',
	'blob',
	'block-editor',
	'block-library',
	'block-serialization-default-parser',
	'blocks',
	'compose',
	[ 'core-data', {
		'Autogenerated actions': 'src/actions.js',
		'Autogenerated selectors': 'src/selectors.js',
	} ],
	'data',
	'data-controls',
	'date',
	'deprecated',
	'dom',
	'dom-ready',
	'e2e-test-utils',
	'edit-post',
	'element',
	'escape-html',
	'html-entities',
	'i18n',
	'keycodes',
	'plugins',
	'priority-queue',
	'redux-routine',
	'rich-text',
	'shortcode',
	'url',
	'viewport',
	'wordcount',
];

packages.forEach( ( entry ) => {
	if ( ! Array.isArray( entry ) ) {
		entry = [ entry, { 'Autogenerated API docs': 'src/index.js' } ];
	}

	const [ packageName, targets ] = entry;

	Object.entries( targets ).forEach( ( [ token, path ] ) => {
		// Each target operates over the same file, so it needs to be processed synchronously,
		// as to make sure the processes don't overwrite each other.
		const { status, stderr } = spawnSync(
			join( __dirname, '..', 'node_modules', '.bin', 'docgen' ).replace( / /g, '\\ ' ),
			[
				join( 'packages', packageName, path ),
				`--output packages/${ packageName }/README.md`,
				'--to-token',
				`--use-token "${ token }"`,
				'--ignore "/unstable|experimental/i"',
			],
			{ shell: true },
		);

		if ( status !== 0 ) {
			process.stderr.write( `${ packageName } ${ stderr.toString() }\n` );
			process.exit( 1 );
		}
	} );
} );
