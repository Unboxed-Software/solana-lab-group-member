// import { createGroup } from "./create-group" // We'll uncomment this later
// import { createMember } from "./create-member" // We'll uncomment this later
import { getExplorerLink, initializeKeypair, makeKeypairs } from "@solana-developers/helpers"
import { Connection } from "@solana/web3.js"
import dotenv from "dotenv"
import { TokenMetadata } from "@solana/spl-token-metadata"
import { LabNFTMetadata, uploadOffChainMetadata } from "./helpers"
import { getGroupMemberPointerState, getGroupPointerState, getMetadataPointerState, getMint, getTokenGroupMemberState, getTokenMetadata, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
dotenv.config()

const connection = new Connection("http://127.0.0.1:8899")

const payer = await initializeKeypair(connection)

const decimals = 0
const maxMembers = 3

const [groupMintKeypair] = makeKeypairs(1)

// CREATE GROUP METADATA

// UPLOAD OFF-CHAIN METADATA

// FORMAT GROUP TOKEN METADATA

// CREATE GROUP

// FETCH THE GROUP

// DEFINE MEMBER METADATA

// UPLOAD MEMBER METADATA

// FORMAT MEMBER TOKEN METADATA

// CREATE MEMBER MINTS

// FETCH THE GROUP AND MEMBERS