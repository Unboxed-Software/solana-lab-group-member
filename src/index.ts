import {initializeKeypair} from '@solana-developers/helpers'
import {Cluster, Connection, Keypair, clusterApiUrl} from '@solana/web3.js'
import dotenv from 'dotenv'
import {createGroup} from './create-group'
import {TokenMetadata} from '@solana/spl-token-metadata'
import {uploadOffChainMetadata} from './helpers'
dotenv.config()

const CLUSTER: Cluster = 'devnet'

/**
 * Create a connection and initialize a keypair if one doesn't already exists.
 * If a keypair exists, airdrop a sol if needed.
 */
const connection = new Connection(clusterApiUrl(CLUSTER))

const payer = await initializeKeypair(connection, {
	keypairPath: 'path-to-solana-keypair',
})

const decimals = 0
const maxMembers = 3

const collectionMintKeypair = Keypair.generate()

const collectionMetadata = {
	imagePath: 'collection.jpeg',
	tokenName: 'cool-cats-collection',
	tokenDescription: 'Collection of Cool Cat NFTs',
	tokenSymbol: 'MEOWs',
	tokenExternalUrl: 'https://solana.com/',
	tokenAdditionalMetadata: undefined,
	tokenUri: '',
	metadataFileName: 'collection.json',
}

collectionMetadata.tokenUri = await uploadOffChainMetadata(
	collectionMetadata,
	payer
)

const collectionTokenMetadata: TokenMetadata = {
	name: collectionMetadata.tokenName,
	mint: collectionMintKeypair.publicKey,
	symbol: collectionMetadata.tokenSymbol,
	uri: collectionMetadata.tokenUri,
	updateAuthority: payer.publicKey,
	additionalMetadata: Object.entries(
		collectionMetadata.tokenAdditionalMetadata || []
	).map(([trait_type, value]) => [trait_type, value]),
}

const signature = await createGroup(
	connection,
	payer,
	collectionMintKeypair,
	decimals,
	maxMembers,
	collectionTokenMetadata
)

console.log(`Created collection mint with metadata. Signature: ${signature}`)

// DEFINE MEMBER METADATA

// UPLOAD MEMBER METADATA AND CREATE MEMBER MINT
