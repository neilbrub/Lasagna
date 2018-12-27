# Lasagna
_Implementation of Youtube's Data API v3_

### Background
_Written to help with a stats project._

Wanted to compare viewcounts on PewDiePie vs T-Series' videos, given a similar number of subscribers.
To make it a fair representation of recent content, we defined our population of interest to be the 500 most recent videos from each channel.

As per project parameters we needed to take a simple random sample from each population to leverage the central limit theorem,
so we selected random videos from each channel's population of 500, giving us a sample population for each channel.

We performed statistical analysis on each sample population, ultimately finding with 90% confidence that T-Series had a significant lead over Pewds in average video views.


### How it works
To make a csv file with viewcounts of the most recent 500 videos of a channel, run `generate_viewcounts.js` providing the appropriate channelId.
This generates a csv file that can be read by `take_sample.js`, which uses random.org's API to take a simple random sample of those 500 viewcounts and write the result to another csv.

In practice this sample population is useless (we have the actual population already!), but we got to use an API that generates a bunch of random numbers so ain't that dandy.
