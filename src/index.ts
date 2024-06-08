import { getExplorerLink, initializeKeypair, makeKeypairs } from "@solana-developers/helpers"
import { Connection } from "@solana/web3.js"
import dotenv from "dotenv"
import { TokenMetadata } from "@solana/spl-token-metadata"
import { LabNFTMetadata, uploadOffChainMetadata } from "./helpers"
import { createTokenGroup } from "./create-group"
import { getGroupPointerState, getMetadataPointerState, getMint, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
dotenv.config()

const connection = new Connection("http://127.0.0.1:8899")

const payer = await initializeKeypair(connection)

const decimals = 0
const maxMembers = 3

const [collectionMintKeypair] = makeKeypairs(1)

// (Group Lesson) CREATE COLLECTION METADATA
const collectionMetadata: LabNFTMetadata = {
	mint: collectionMintKeypair,
	imagePath: "assets/collection.png",
	tokenName: "cool-cats-collection",
	tokenDescription: "Collection of Cool Cat NFTs",
	tokenSymbol: "MEOW",
	tokenExternalUrl: "https://solana.com/",
	tokenAdditionalMetadata: {},
	tokenUri: "",
}

// (Group Lesson) UPLOAD OFF-CHAIN METADATA
collectionMetadata.tokenUri = await uploadOffChainMetadata(
	payer,
	collectionMetadata
)

// (Group Lesson) FORMAT TOKEN METADATA
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

// (Group Lesson) CREATE GROUP
const signature = await createTokenGroup(
	connection,
	payer,
	collectionMintKeypair,
	decimals,
	maxMembers,
	collectionTokenMetadata
)

console.log(`Created collection mint with metadata:\n${getExplorerLink("tx", signature, 'localnet')}\n`)

// (Group Lesson) FETCH THE GROUP
const groupMint = await getMint(connection, collectionMintKeypair.publicKey, "confirmed", TOKEN_2022_PROGRAM_ID);
const groupMetadata = await getTokenMetadata(connection, collectionMintKeypair.publicKey);
const metadataPointerState = getMetadataPointerState(groupMint);
const groupData = getGroupPointerState(groupMint);

console.log("\n---------- GROUP DATA -------------\n");
console.log("Group Mint: ", groupMint.address.toBase58());
console.log("Metadata Pointer Account: ", metadataPointerState?.metadataAddress?.toBase58());
console.log("Group Pointer Account: ", groupData?.groupAddress?.toBase58());
console.log("\n--- METADATA ---\n");
console.log("Name: ", groupMetadata?.name);
console.log("Symbol: ", groupMetadata?.symbol);
console.log("Uri: ", groupMetadata?.uri);
console.log("\n------------------------------------\n");

// (Member Lesson) DEFINE MEMBER METADATA

// (Member Lesson) UPLOAD MEMBER METADATA AND CREATE MEMBER MINT

