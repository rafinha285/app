import { types } from "cassandra-driver"
import { Anime, Producer, Season } from "../src/types/animeModel"
import { Console } from "./assets/handle"
import { client } from "./database/pool"
import { pgClient } from "./database/Postgre"
import { tupleToSeason } from "../src/functions/animeFunctions"
import { Episode } from "../src/types/episodeModel"
import * as pg from 'pg'
const con = pgClient.connect()
async function main(){
    await client.connect()
    var scyllaAnimes = await client.execute("SELECT * FROM anime ALLOW FILTERING")
    for(let i = 0;i<scyllaAnimes.rows.length;i++){
        let {
                id,
                averageeptime,
                creators,
                date_added,
                description,
                genre,
                language,
                name,
                name2,
                producers,
                quality,
                rating,
                releasedate,
                seasons,
                state,
                studios,
                visible,
                weekday
            } = scyllaAnimes.rows[i]
        // Console.log(scyllaAnimes.rows[i])
        let anime:Anime = {
            id:id.toString(),
            name,
            name2,
            averageeptime,
            creators,
            date_added,
            description,
            genre,
            language,
            producers,
            quality,
            rating,
            releasedate,
            seasons,
            state,
            studios,
            visible,
            weekday
        }
        let producersP:Producer[] = []
        let creatorsP:Producer[] = []
        let studiosP:Producer[] = []
        // console.log(anime.producers)
        for(let j = 0;j<anime.producers.length;j++){
            let cria = tupleToProducer(anime.producers[j])
            // console.log(anime.producers[j])
            // console.log("prod")
            // console.log(cria)
            await insertProds(cria,'producers')
            producersP.push(cria)
        }
        for(let j = 0;j<anime.creators.length;j++){
            let cria = tupleToProducer(anime.creators[j])
            console.log(anime.creators[j])
            console.log("cria")
            console.log(cria)
            await insertProds(cria,'creators')
            creatorsP.push(cria)
        }
        for(let j = 0;j<anime.studios.length;j++){
            var stud = tupleToProducer(anime.studios[j])
            console.log(anime.studios[j])
            console.log("stud")
            console.log(stud)
            await insertProds(stud,'studios')
            studiosP.push(stud)
        }
        anime.producers = producersP
        anime.creators = creatorsP
        anime.studios = studiosP

        await insertAnime(anime)


        var seasonsT = tupleToSeason(anime.seasons as types.Tuple[])
        console.log(seasonsT)
        for(let j =0;j<seasonsT.length;j++){
            console.log(seasonsT[j])
            await insertSeasons(seasonsT[j],anime.id)
        }


    }
    var scyllaEpisodes = await client.execute("SELECT * FROM episodes")
    console.log(scyllaEpisodes.rows[0])
    for(let i = 0;i<scyllaEpisodes.rows.length;i++){
        // Console.log(scyllaEpisodes)
        let {id,animeid,audiotracks,date_added,duration,ending,epindex,name,openingend,openingstart,releasedate,resolution,seasonid,subtitlestracks,views} = scyllaEpisodes.rows[i];
        if((await (await con).query("SELECT name FROM anime.episodes WHERE id = $1 AND anime_id = $2 AND season_id = $3",[id.toString(),animeid.toString(),seasonid.toString()])).rows.length === 0){
            (await con).query(`INSERT INTO anime.episodes (
                id,
                anime_id,
                audiotracks,
                date_added,
                duration,
                ending,
                epindex,
                name,
                openingend,
                openingstart,
                releasedate,
                resolution,
                season_id,
                subtitlestracks,
                views
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15
            )`,[
                id.toString(),
                animeid.toString(),
                audiotracks,
                date_added,
                duration,
                ending,
                epindex,
                name,
                openingend,
                openingstart,
                releasedate,
                resolution,
                seasonid.toString(),
                subtitlestracks,
                views
            ])
        }
    }
}
function tupleToProducer(prod:any):Producer{
    // console.log(prod)
    return {id:prod.elements[0],name:prod.elements[1]}
}
async function insertProds(prod:{name,id},type:"producers"|"creators"|'studios'){
    if(!((await (await con).query(`SELECT id FROM anime.${type} WHERE id = $1`,[prod.id.toString()])).rows.length > 0)){
        console.log("Inserting new entry");
        await (await con).query(`INSERT INTO anime.${type} (id, name) VALUES ($1,$2)`,[prod.id.toString(),prod.name])
    }else{
        console.log("cu nao")
    }
}
async function insertSeasons(season:Season,animeId:string){
    if((await (await con).query("SELECT id FROM anime.seasons WHERE id = $1 AND anime_id = $2",[season.id.toString(),animeId])).rows.length === 0){
        await (await con).query(`INSERT INTO anime.seasons (id,anime_id,name,episodes,index) VALUES ($1,$2,$3,$4,$5)`,[season.id.toString(),animeId,season.name,season.episodes,season.index])
    }
}
async function insertAnime({
        id,
        averageeptime,
        date_added,
        description,
        genre,
        language,
        name,
        name2,
        producers,
        studios,
        creators,
        quality,
        rating,
        visible,
        weekday,  
    }:Anime) {
        Console.log("insert anime")
        if(!((await (await con).query(`SELECT id FROM anime.anime WHERE id = $1`,[id])).rows.length>0)){
            await (await con).query(`
                INSERT INTO anime.anime (
                    id,
                    averageeptime,
                    date_added,
                    description,
                    genre,
                    language,
                    name,
                    name2,
                    quality,
                    rating,
                    visible,
                    weekday
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12
                )
            `,[
                id,
                averageeptime,
                date_added,
                description,
                genre,
                language,
                name,
                name2,
                quality,
                rating,
                true,
                weekday
            ])
        }else{
            Console.log("cuzao")
        }
        const producerIds = producers.map(v => v.id.toString());
        const creatorIds = creators.map(v => v.id.toString());
        const studioIds = studios.map(v => v.id.toString());
    
        // Atualizar produtores
        await (await con).query(`
            UPDATE anime.anime 
            SET producers = $1 
            WHERE id = $2
        `, [
            producerIds, // Passar array de strings
            id // ID do anime
        ]);
    
        // Atualizar criadores
        await (await con).query(`
            UPDATE anime.anime 
            SET creators = $1 
            WHERE id = $2
        `, [
            creatorIds, // Passar array de strings
            id // ID do anime
        ]);
    
        // Atualizar estúdios
        await (await con).query(`
            UPDATE anime.anime 
            SET studios = $1 
            WHERE id = $2
        `, [
            studioIds, // Passar array de strings
            id // ID do anime
        ]);
}
main()