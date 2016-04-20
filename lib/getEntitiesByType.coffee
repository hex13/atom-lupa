Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata

isArray = (obj) ->
    Object.prototype.toString.call(obj) == '[object Array]'

getEntitiesByType = (f, type) ->
    try
        item = getMetadata(f).filter((item) -> item.name == type)
            .reduce (res, item)->
                if isArray(item.data) && item.data.length > 1
                    res.concat(item.data.map (entity) ->
                        if entity.substr
                            return {name: 'module', data: entity}
                        else
                            return Object.assign({name: 'module', data: entity.name})
                    )
                else
                    res.concat(item)
            ,[]
            .map (item)->
                Object.assign({}, item, {path: f.path, file: f})
    catch e
        console.log("KURWA", e)
    console.log "GET ENTITIES BY TYPE", f, type, "=>", item
    return item

module.exports = getEntitiesByType
