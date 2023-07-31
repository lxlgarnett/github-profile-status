/*
 * Created by Xiaolei Li on 7/31/23, 7:37 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 7/31/23, 5:20 PM
 */

package com.lxlgarnett.githubprofilestatus.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class GreetingResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello from RESTEasy Reactive";
    }
}
