import { getExplorerLink, initializeKeypair, makeKeypairs } from "@solana-developers/helpers"
import { Connection, Keypair } from "@solana/web3.js"
import dotenv from "dotenv"
import { TokenMetadata } from "@solana/spl-token-metadata"
import { LabNFTMetadata, uploadOffChainMetadata } from "./helpers"
import { createTokenGroup } from "./create-group"
import { getGroupMemberPointerState, getGroupPointerState, getMetadataPointerState, getMint, getTokenGroupMemberState, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
import { createTokenMember } from "./create-member"
dotenv.config()

const connection = new Connection("http://127.0.0.1:8899")

const payer = await initializeKeypair(connection)

const decimals = 0
const maxMembers = 3

const [groupMintKeypair, cat0Mint, cat1Mint, cat2Mint] = makeKeypairs(1)

// CREATE GROUP METADATA
const groupMetadata: LabNFTMetadata = {
	mint: groupMintKeypair,
	imagePath: "assets/collection.png",
	tokenName: "cool-cats-collection",
	tokenDescription: "Collection of Cool Cat NFTs",
	tokenSymbol: "MEOW",
	tokenExternalUrl: "https://solana.com/",
	tokenAdditionalMetadata: {},
	tokenUri: "",
}

// UPLOAD OFF-CHAIN METADATA
groupMetadata.tokenUri = await uploadOffChainMetadata(
	payer,
	groupMetadata
)

// FORMAT GROUP TOKEN METADATA
const collectionTokenMetadata: TokenMetadata = {
	name: groupMetadata.tokenName,
	mint: groupMintKeypair.publicKey,
	symbol: groupMetadata.tokenSymbol,
	uri: groupMetadata.tokenUri,
	updateAuthority: payer.publicKey,
	additionalMetadata: Object.entries(
		groupMetadata.tokenAdditionalMetadata || []
	).map(([trait_type, value]) => [trait_type, value]),
}

// CREATE GROUP
const signature = await createTokenGroup(
	connection,
	payer,
	groupMintKeypair,
	decimals,
	maxMembers,
	collectionTokenMetadata
)

console.log(`Created collection mint with metadata:\n${getExplorerLink("tx", signature, 'localnet')}\n`)

// FETCH THE GROUP
const groupMint = await getMint(connection, groupMintKeypair.publicKey, "confirmed", TOKEN_2022_PROGRAM_ID);
const fetchedGroupMetadata = await getTokenMetadata(connection, groupMintKeypair.publicKey);
const metadataPointerState = getMetadataPointerState(groupMint);
const groupData = getGroupPointerState(groupMint);

console.log("\n---------- GROUP DATA -------------\n");
console.log("Group Mint: ", groupMint.address.toBase58());
console.log("Metadata Pointer Account: ", metadataPointerState?.metadataAddress?.toBase58());
console.log("Group Pointer Account: ", groupData?.groupAddress?.toBase58());
console.log("\n--- METADATA ---\n");
console.log("Name: ", fetchedGroupMetadata?.name);
console.log("Symbol: ", fetchedGroupMetadata?.symbol);
console.log("Uri: ", fetchedGroupMetadata?.uri);
console.log("\n------------------------------------\n");

// DEFINE MEMBER METADATA
const membersMetadata: LabNFTMetadata[] = [
	{
		mint: cat0Mint,
		imagePath: "assets/cat_0.png",
		tokenName: "Cat 1",
		tokenDescription: "Adorable cat",
		tokenSymbol: "MEOW",
		tokenExternalUrl: "https://solana.com/",
		tokenAdditionalMetadata: {},
		tokenUri: "",
	},
	{
		mint: cat1Mint,
		imagePath: "assets/cat_1.png",
		tokenName: "Cat 2",
		tokenDescription: "Sassy cat",
		tokenSymbol: "MEOW",
		tokenExternalUrl: "https://solana.com/",
		tokenAdditionalMetadata: {},
		tokenUri: "",
	},
	{
		mint: cat2Mint,
		imagePath: "assets/cat_2.png",
		tokenName: "Cat 3",
		tokenDescription: "Silly cat",
		tokenSymbol: "MEOW",
		tokenExternalUrl: "https://solana.com/",
		tokenAdditionalMetadata: {},
		tokenUri: "",
	},
]

// UPLOAD MEMBER METADATA
for (const member of membersMetadata) {
	member.tokenUri = await uploadOffChainMetadata(
		payer,
		member
	)
}

// FORMAT MEMBER TOKEN METADATA
const memberTokenMetadata: {mintKeypair: Keypair, metadata: TokenMetadata}[] = membersMetadata.map(member => ({
    mintKeypair: member.mint,
    metadata: {
        name: member.tokenName,
        mint: member.mint.publicKey,
        symbol: member.tokenSymbol,
        uri: member.tokenUri,
        updateAuthority: payer.publicKey,
        additionalMetadata: Object.entries(member.tokenAdditionalMetadata || []).map(([trait_type, value]) => [trait_type, value]),
    } as TokenMetadata
}))

// CREATE MEMBER MINTS
for (const memberMetadata of memberTokenMetadata) {

	const signature = await createTokenMember(
		connection,
		payer,
		memberMetadata.mintKeypair,
		decimals,
		memberMetadata.metadata,
		groupMintKeypair.publicKey
	)

	console.log(`Created ${memberMetadata.metadata.name} NFT:\n${getExplorerLink("tx", signature, 'localnet')}\n`)

}

// FETCH THE MEMBERS
for (const member of membersMetadata) {
	const memberMint = await getMint(connection, member.mint.publicKey, "confirmed", TOKEN_2022_PROGRAM_ID);
	const memberMetadata = await getTokenMetadata(connection, member.mint.publicKey);
	const metadataPointerState = getMetadataPointerState(memberMint);
	const memberPointerData = getGroupMemberPointerState(memberMint);
	const memberData = getTokenGroupMemberState(memberMint);

	console.log("\n---------- MEMBER DATA -------------\n");
	console.log("Member Mint: ", memberMint.address.toBase58());
	console.log("Metadata Pointer Account: ", metadataPointerState?.metadataAddress?.toBase58());
	console.log("Group Account: ", memberData?.group?.toBase58());
	console.log("Member Pointer Account: ", memberPointerData?.memberAddress?.toBase58());
	console.log("Member Number: ", memberData?.memberNumber);
	console.log("\n--- METADATA ---\n");
	console.log("Name: ", memberMetadata?.name);
	console.log("Symbol: ", memberMetadata?.symbol);
	console.log("Uri: ", memberMetadata?.uri);
	console.log("\n------------------------------------\n");
	
}

