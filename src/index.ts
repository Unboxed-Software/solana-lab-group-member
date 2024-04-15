import {initializeKeypair} from '@solana-developers/helpers'
import {Cluster, Connection, Keypair} from '@solana/web3.js'
import dotenv from 'dotenv'
import {createGroup} from './create-group'
import {TokenMetadata} from '@solana/spl-token-metadata'
import {uploadOffChainMetadata} from './helpers'
import {createMember} from './create-member'
dotenv.config()

const CLUSTER: Cluster = 'devnet'

/**
 * Create a connection and initialize a keypair if one doesn't already exists.
 * If a keypair exists, airdrop a sol if needed.
 */
const connection = new Connection('http://127.0.0.1:8899')

const payer = await initializeKeypair(connection)

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

const membersMetadata = [
	{
		imagePath: 'src/assets/1.jpeg',
		tokenName: 'Cat 1',
		tokenDescription: 'Two cool cats',
		tokenSymbol: 'MEOW',
		tokenExternalUrl: 'https://solana.com/',
		tokenAdditionalMetadata: {
			species: 'Cat',
			breed: 'Cool',
		},
		tokenUri: '',
		metadataFileName: '1.json',
	},
	{
		imagePath: 'src/assets/2.jpeg',
		tokenName: 'Cat 2',
		tokenDescription: 'Sassy cat',
		tokenSymbol: 'MEOW',
		tokenExternalUrl: 'https://solana.com/',
		tokenAdditionalMetadata: {
			species: 'Cat',
			breed: 'Cool',
		},
		tokenUri: '',
		metadataFileName: '2.json',
	},
	{
		imagePath: 'src/assets/3.jpeg',
		tokenName: 'Cat 3',
		tokenDescription: 'Silly cat',
		tokenSymbol: 'MEOW',
		tokenExternalUrl: 'https://solana.com/',
		tokenAdditionalMetadata: {
			species: 'Cat',
			breed: 'Cool',
		},
		tokenUri: 'https://solana.com/',
		metadataFileName: '3.json',
	},
]

membersMetadata.forEach(async (memberMetadata) => {
	const memberMintKeypair = Keypair.generate()

	memberMetadata.tokenUri = await uploadOffChainMetadata(
		memberMetadata,
		payer
	)

	const tokenMetadata: TokenMetadata = {
		name: memberMetadata.tokenName,
		mint: memberMintKeypair.publicKey,
		symbol: memberMetadata.tokenSymbol,
		uri: memberMetadata.tokenUri,
		updateAuthority: payer.publicKey,
		additionalMetadata: Object.entries(
			memberMetadata.tokenAdditionalMetadata || []
		).map(([trait_type, value]) => [trait_type, value]),
	}

	const signature = await createMember(
		connection,
		payer,
		memberMintKeypair,
		decimals,
		tokenMetadata,
		collectionMintKeypair.publicKey
	)

	console.log(
		'Created member NFT: ',
		signature,
		memberMintKeypair.publicKey.toBase58()
	)
})
