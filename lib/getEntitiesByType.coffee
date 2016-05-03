Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata

isArray = (obj) ->
    Object.prototype.toString.call(obj) == '[object Array]'

getEntitiesByType = (f, type) ->
    filterByType = (item) -> item.type == type
    filter = if type then filterByType else -> true
    try
        item = getMetadata(f).filter(filter)
            .reduce (res, item)->
                if isArray(item.data) && item.data.length > 1
                    res.concat(item.data.map (entity) ->
                        if entity.substr
                            return {type: 'module', data: entity}
                        else
                            return Object.assign({type: 'module', data: entity.name})
                    )
                else
                    res.concat(item)
            ,[]
            .map (item)->
                Object.assign({}, item, {path: f.path, file: f})
    catch e
        console.log("Error", e)
    return item

module.exports = getEntitiesByType
