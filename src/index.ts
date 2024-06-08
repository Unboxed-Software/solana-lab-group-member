import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers"
import { Connection } from "@solana/web3.js"
import dotenv from "dotenv"
// import { createGroup } from "./create-group" // We'll uncomment this later
// import { uploadOffChainMetadata } from "./helpers" // We'll uncomment this later
import { TokenMetadata } from "@solana/spl-token-metadata"
dotenv.config()

const connection = new Connection("http://127.0.0.1:8899")

const payer = await initializeKeypair(connection)

const decimals = 0
const maxMembers = 3

const [collectionMintKeypair] = makeKeypairs(1)

// (Group Lesson) CREATE COLLECTION METADATA

// (Group Lesson) UPLOAD OFF-CHAIN METADATA

// (Group Lesson) FORMAT TOKEN METADATA

// (Group Lesson) CREATE GROUP

// (Member Lesson) DEFINE MEMBER METADATA

// (Member Lesson) UPLOAD MEMBER METADATA AND CREATE MEMBER MINT

