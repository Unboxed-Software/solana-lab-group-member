import {initializeKeypair} from '@solana-developers/helpers'
import {Cluster, Connection, Keypair} from '@solana/web3.js'
import dotenv from 'dotenv'
import {createGroup} from './create-group'
import {TokenMetadata} from '@solana/spl-token-metadata'
import {uploadOffChainMetadata} from './helpers'
import {createMember} from './create-member'
dotenv.config()

const CLUSTER: Cluster = 'devnet'

async function main() {
	/**
	 * Create a connection and initialize a keypair if one doesn't already exists.
	 * If a keypair exists, airdrop a sol if needed.
	 */
	const connection = new Connection('http://127.0.0.1:8899')

	const payer = await initializeKeypair(connection)

	console.log(`public key: ${payer.publicKey.toBase58()}`)

	const decimals = 0
	const maxMembers = 3

	const collectionMintKeypair = Keypair.generate()
	let mint = collectionMintKeypair.publicKey
	console.log(
		'\nmint public key: ' +
			collectionMintKeypair.publicKey.toBase58() +
			'\n\n'
	)

	const collectionMetadata: TokenMetadata = {
		name: 'cool-cats',
		updateAuthority: payer.publicKey,
		mint,
		symbol: 'MEOW',
		uri: 'https://solana.com/',
		additionalMetadata: [
			['species', 'Cat'],
			['breed', 'Cool'],
		],
	}

	const signature = await createGroup(
		connection,
		payer,
		collectionMintKeypair,
		decimals,
		maxMembers,
		collectionMetadata
	)

	console.log(
		`Created collection mint with metadata. Signature: ${signature}`
	)

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
		},
	]

	membersMetadata[0].tokenUri = await uploadOffChainMetadata(
		membersMetadata[0]
	)
}

main()
